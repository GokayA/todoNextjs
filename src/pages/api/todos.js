import connectMongo from '@/lib/mongodb';
import Todo from '@/models/todo';
import mongoose from 'mongoose';

export async function handler(req, res) {
  await connectMongo();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const userId = req.headers.userid;
        const todos = await Todo.find({ userId: userId });
        res.status(200).json(todos);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server not working' });
      }
      break;
    case 'POST':
      try {
        const { title, description, userId } = req.body;

        const todo = new Todo({
          title: title,
          description: description,
          userId: userId,
        });
        await todo.save();
        res.status(201).json({ message: 'Todo created successfully', todo });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server not working' });
      }
      break;
    case 'DELETE':
      try {
        const { id, userid } = req.headers;
        const todo = await Todo.find({ _id: id });
        const userId = todo[0].userId.toString();
        if (!todo) {
          return res.status(404).json({ message: 'This Todo not found' });
        }
        if (userId !== userid) {
          console.log('yok');
          return res.status(401).json({ message: 'not allowed' });
        }
        await Todo.deleteOne({ _id: id });
        res.status(200).json({ message: 'Todo deleted succesfully' });
      } catch (error) {
        console.log(error);
      }
      break;

    case 'PUT':
      try {
        const { title, description } = req.body;
        const todo = await Todo.findById(id);
        if (!todo) {
          return res.status(404).json({ message: 'This Todo not found' });
        }
        if (todo.user.toString() !== req.userId) {
          return res.status(401).json({ message: 'not allowed' });
        }
        todo.title = title;
        todo.description = description;
        await todo.save();
        res.status(200).json({ message: 'Todo updated succesfully', todo });
      } catch (err) {
        console.log(err);
      }
      break;
    default:
      res.status(405).json({ message: 'Not allowed' });
      break;
  }
}

// export async function getById(req, res) {
//   const {
//     query: { id },
//     method,
//   } = req;
//   await connectMongo();

//   switch (method) {
//     case 'GET':
//       try {
//         const todo = await Todo.findById(id);
//         if (!todo) {
//           return res.status(404).json({ message: 'This Todo not found' });
//         }
//         if (todo.user.toString() !== req.userId) {
//           return res.status(401).json({ message: 'not allowed' });
//         }
//         res.status(200).json(todo);
//       } catch (error) {
//         console.log(error);
//         res.status(500);
//       }
//       break;
//     case 'PUT':
//       try {
//         const { title, description } = req.body;
//         const todo = await Todo.findById(id);
//         if (!todo) {
//           return res.status(404).json({ message: 'This Todo not found' });
//         }
//         if (todo.user.toString() !== req.userId) {
//           return res.status(401).json({ message: 'not allowed' });
//         }
//         todo.title = title;
//         todo.description = description;
//         await todo.save();
//         res.status(200).json({ message: 'Todo updated succesfully', todo });
//       } catch (err) {
//         console.log(err);
//       }
//       break;
//     case 'DELETE':
//       try {
//         const todo = await Todo.findById(id);
//         if (!todo) {
//           return res.status(404).json({ message: 'This Todo not found' });
//         }
//         if (todo.user.toString() !== req.userId) {
//           return res.status(401).json({ message: 'not allowed' });
//         }

//         await todo.remove();
//         res.status(200).json({ message: 'Todo deleted succesfully' });
//       } catch (error) {
//         console.log(error);
//       }
//       break;
//     default:
//       res.status(405).json({ message: 'Not allowed' });
//       break;
//   }
// }

export default handler;
